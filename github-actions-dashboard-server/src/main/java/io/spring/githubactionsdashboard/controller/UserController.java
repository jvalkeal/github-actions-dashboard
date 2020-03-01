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

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import io.spring.githubactionsdashboard.domain.Setting;
import io.spring.githubactionsdashboard.entity.UserSetting;
import io.spring.githubactionsdashboard.repository.SettingsRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Controller for returning info for current logged in user.
 *
 * @author Janne Valkealahti
 *
 */
@RestController
@RequestMapping("/user")
public class UserController {

	private final static Logger log = LoggerFactory.getLogger(UserController.class);
	private final SettingsRepository settings;

	public UserController(SettingsRepository settings) {
		this.settings = settings;
	}

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

	@RequestMapping(path = "/settings", method = RequestMethod.GET)
	@ResponseBody
	public Flux<Setting> getSettings(@AuthenticationPrincipal OAuth2User oauth2User) {
		return Flux.fromIterable(this.settings.findByUsername(oauth2User.getName()))
			.map(userSetting -> new Setting(userSetting.getName(), userSetting.getValue()));
	}

	@RequestMapping(path = "/settings", method = RequestMethod.POST)
	public Mono<Void> saveSettings(@AuthenticationPrincipal OAuth2User oauth2User,
			@RequestBody List<Setting> settings) {
		return Flux.fromIterable(settings)
			.map(s -> new UserSetting(oauth2User.getName(), s.getName(), s.getValue()))
			.collectList()
			.doOnNext(l -> {
				this.settings.saveAll(l);
			})
			.then();
	}

	@RequestMapping(path = "/settingsx", method = RequestMethod.GET)
	public Mono<Void> saveSettingsx(@AuthenticationPrincipal OAuth2User oauth2User,
			@RequestParam("key") String key, @RequestParam("value") String value) {
		return Mono.just(new UserSetting(oauth2User.getName(), key, value))
			.doOnNext(s -> {
				log.info("Saving {}", s);
				UserSetting saved = this.settings.save(s);
				log.info("Saved {}", saved);
			})
			.then();
	}
}
