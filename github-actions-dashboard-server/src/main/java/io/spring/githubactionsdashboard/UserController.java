package io.spring.githubactionsdashboard;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/user")
public class UserController {

	@RequestMapping("/whoami")
	@ResponseBody
	public OAuth2User whoami(@AuthenticationPrincipal OAuth2User oauth2User) {
		if (oauth2User != null) {
			return oauth2User;
		}
		throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
	}
}
