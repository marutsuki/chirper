package io.marutsuki.chirper.service.auth.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JWTService
{
    private static final String SECRET_KEY = "f3763d2fbc4f316986667f1d6f515f0b6c165b915ec0d0635efc6e9b2b1677ac";

    //Returns the username from the jwt token
    public String ExtractUsername(String jwtToken)
    {
        return ExtractClaim(jwtToken, Claims::getSubject);
    }

    //Returns the expiration date from the jwt token
    public Date ExtractExpirationDate(String jwtToken)
    {
        return ExtractClaim(jwtToken, Claims::getExpiration);
    }

    //Extract all claims from a jwtToken
    private Claims ExtractAllClaims(String jwtToken)
    {
        return Jwts.parser()
                .setSigningKey(getSigningKey())
                .parseClaimsJws(jwtToken)
                .getBody();
    }

    //Extract a singular claim, pass a claims resolver like Claims::getSubject
    public <T> T ExtractClaim(String jwtToken, Function<Claims, T> claimsResolver)
    {
        final Claims claims = ExtractAllClaims(jwtToken);
        return claimsResolver.apply(claims);
    }

    //Generate a JWT token just from user details
    public String GenerateToken(UserDetails userDetails)
    {
        return GenerateToken(new HashMap<>(), userDetails);
    }

    //Generate a JWT token from extra claims and user details
    public String GenerateToken(Map<String, Object> extraClaims, UserDetails userDetails)
    {
        long expirationTime = 24 * 60 * 1000;

        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    //Checks if the jwt token is valid with correct username and within expiration date
    public boolean IsTokenValid(String jwtToken, UserDetails userDetails)
    {
        final String username = ExtractUsername(jwtToken);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(jwtToken));
    }

    //Checks if jwt token's date is past current time
    private boolean isTokenExpired(String jwtToken)
    {
        return ExtractExpirationDate(jwtToken).after(new Date());
    }

    //Returns the signing key
    private SecretKey getSigningKey()
    {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

}
