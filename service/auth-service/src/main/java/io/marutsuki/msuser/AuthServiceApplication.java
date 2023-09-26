package io.marutsuki.msuser;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication

public class AuthServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuthServiceApplication.class, args);
	}

}

//@RestController
//@RequestMapping("/api/v1/greetings")
//class GreetingsController
//{
//	@GetMapping
//	public ResponseEntity<String> sayHello()
//	{
//		return ResponseEntity.ok("Hello from API");
//	}
//
//	@GetMapping("/say-good-bye")
//	public ResponseEntity<String> sayGoodbye()
//	{
//		return ResponseEntity.ok("Goodbye from API");
//	}
//}
