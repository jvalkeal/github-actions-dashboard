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

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.spring.githubactionsdashboard.domain.Setting;
import io.spring.githubactionsdashboard.entity.UserSetting;
import io.spring.githubactionsdashboard.repository.SettingsRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Controller for user settings.
 *
 * @author Janne Valkealahti
 *
 */
@RestController
@RequestMapping("/user/settings")
public class SettingsController {

	private final static Logger log = LoggerFactory.getLogger(SettingsController.class);
	private final SettingsRepository settings;

	public SettingsController(SettingsRepository settings) {
		this.settings = settings;
	}

	@RequestMapping(method = RequestMethod.GET)
	@ResponseBody
	public Flux<Setting> getSettings(@AuthenticationPrincipal OAuth2User oauth2User) {
		return Flux
			.fromIterable(this.settings.findByUsername(oauth2User.getName()))
			.map(userSetting -> Setting.of(userSetting.getName(), userSetting.getValue()));
	}

	@RequestMapping(method = RequestMethod.POST)
	public Mono<Void> saveSettings(@AuthenticationPrincipal OAuth2User oauth2User,
			@RequestBody List<Setting> settings) {
		String username = oauth2User.getName();
		return Flux
			.fromIterable(settings)
			.map(s -> UserSetting.of(username, s))
			.collectList()
			.doOnNext(userSettings -> {
				log.debug("Saving user={} settings={}", username, userSettings);
				this.settings.saveAll(userSettings);
			})
			.then();
	}
}
