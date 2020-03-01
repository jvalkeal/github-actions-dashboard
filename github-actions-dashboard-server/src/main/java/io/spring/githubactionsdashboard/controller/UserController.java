/*
 * Copyright 2020 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.spring.githubactionsdashboard.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * Controller for returning info for current logged in user.
 *
 * @author Janne Valkealahti
 *
 */
@RestController
@RequestMapping("/user")
public class UserController {

	/**
	 * Gets a current logged in user or simply return 401 if no user. Mostly used by
	 * UI to check if user is actually logged in.
	 *
	 * @param oauth2User current logged in user if any
	 * @return the current logged in user
	 */
	@RequestMapping("/whoami")
	@ResponseBody
	public OAuth2User whoami(@AuthenticationPrincipal OAuth2User oauth2User) {
		if (oauth2User != null) {
			return oauth2User;
		}
		throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
	}
}
