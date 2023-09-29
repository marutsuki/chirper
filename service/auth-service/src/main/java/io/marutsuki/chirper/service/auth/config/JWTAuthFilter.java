package io.marutsuki.chirper.service.auth.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


@Component
@RequiredArgsConstructor
public class JWTAuthFilter extends  OncePerRequestFilter
{
    private JWTService jwtService;
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException
    {
        final String authHeader = request.getHeader("Authorization");
        final String userName;
        final String jwtToken;


        //Filter erroneous requests
        if (authHeader == null || !authHeader.startsWith("Bearer "))
        {
            filterChain.doFilter(request, response);
            return;
        }

        jwtToken = authHeader.substring(7);
        userName = jwtService.ExtractUsername(jwtToken);

        if (userName != null && SecurityContextHolder.getContext().getAuthentication() == null)
        {
            //User is valid but not connected
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userName);

            if (jwtService.IsTokenValid(jwtToken, userDetails))
            {
                //User token is valid
                UsernamePasswordAuthenticationToken authToken = new
                        UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                //Update security context holder
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }

            //Do next security filter
            filterChain.doFilter(request, response);
        }
    }
}
