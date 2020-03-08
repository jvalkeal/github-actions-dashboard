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

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
	private final SettingsRepository repository;

	public SettingsController(SettingsRepository settings) {
		this.repository = settings;
	}

	@RequestMapping(method = RequestMethod.GET)
	@ResponseBody
	public Flux<Setting> getSettings(@AuthenticationPrincipal OAuth2User oauth2User) {
		return Flux
			.fromIterable(this.repository.findByUsername(oauth2User.getName()))
			.map(userSetting -> Setting.of(userSetting.getName(), userSetting.getValue()));
	}

	@RequestMapping(method = RequestMethod.POST)
	public Mono<Void> saveSettings(@AuthenticationPrincipal OAuth2User oauth2User,
			@RequestBody List<Setting> settings) {
		log.debug("Saving settings for user={} settings={}", oauth2User, settings);
		String username = oauth2User.getName();

		Mono<Map<String, UserSetting>> left = Mono.fromSupplier(() -> this.repository.findByUsername(username))
			.map(list -> list.stream().collect(Collectors.toMap(i -> i.getName(), i -> i)));

		Mono<Map<String, UserSetting>> right = Flux.fromIterable(settings)
			.map(setting -> UserSetting.of(username, setting))
			.collectMap(s -> s.getName(), s -> s);

		return Mono.zip(left, right)
			.map(tuple -> merge(tuple.getT1(), tuple.getT2()))
			.doOnNext(userSettings -> {
				log.debug("Saving user={} settings={}", username, userSettings);
				this.repository.saveAll(userSettings);
			})
			.then();
	}

	private List<UserSetting> merge(Map<String, UserSetting> left, Map<String, UserSetting> right) {
		ArrayList<UserSetting> out = new ArrayList<>();
		out.addAll(left.values());
		right.forEach((k, v) -> {
			UserSetting us = left.get(k);
			if (us != null) {
				us.setValue(v.getValue());
			} else {
				us = UserSetting.of(v.getUsername(), Setting.of(v.getName(), v.getValue()));
				out.add(us);
			}
		});
		return out;
	}
}
