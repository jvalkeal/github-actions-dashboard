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
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.spring.githubactionsdashboard.domain.RepositoryDispatch;
import io.spring.githubactionsdashboard.entity.RepositoryDispatchEntity;
import io.spring.githubactionsdashboard.github.GithubApi;
import io.spring.githubactionsdashboard.repository.RepositoryDispatchRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Controller for handling user level repo dispatch.
 *
 * @author Janne Valkealahti
 *
 */
@RestController
@RequestMapping("/user/dispatches")
public class RepositoryDispatchController {

	private final static Logger log = LoggerFactory.getLogger(RepositoryDispatchController.class);
	private final RepositoryDispatchRepository repository;
	private final ObjectMapper objectMapper;
	private final GithubApi api;

	public RepositoryDispatchController(RepositoryDispatchRepository repository, ObjectMapper objectMapper,
			GithubApi api) {
		this.repository = repository;
		this.objectMapper = objectMapper;
		this.api = api;
	}

	@RequestMapping(method = RequestMethod.GET)
	@ResponseBody
	public Flux<RepositoryDispatch> getDispatches(@AuthenticationPrincipal OAuth2User oauth2User,
			@RequestParam(name = "team", required = false) String team) {
		Flux<RepositoryDispatch> teamDispatches = this.api.teams()
			.collectMap(t -> t.getCombinedSlug())
			.flatMapMany(teamMap -> Flux.fromIterable(repository.findByTeamIn(teamMap.keySet())))
				.map(entity -> RepositoryDispatch.of(entity.getName(), entity.getTeam(), entity.getEventType(), mapClientPayload(entity.getClientPayload())));
		Flux<RepositoryDispatch> userDispatches = Flux
			.fromIterable(this.repository.findByUsernameAndTeamIsNull(oauth2User.getName()))
			.map(dispatch -> RepositoryDispatch.of(
				dispatch.getName(),
				dispatch.getTeam(),
				dispatch.getEventType(),
				mapClientPayload(dispatch.getClientPayload())));
		return Flux.concat(teamDispatches, userDispatches);
	}

	@RequestMapping(method = RequestMethod.POST)
	public Mono<Void> saveDispatch(@AuthenticationPrincipal OAuth2User oauth2User, @RequestParam("name") String name,
			@RequestParam(name = "team", required = false) String team, @RequestParam("eventType") String eventType,
			@RequestBody(required = false) String clientPayload) {
		log.debug("Saving dispatch request {} {} {} {}", name, team, eventType, clientPayload);
		String username = oauth2User.getName();

		Mono<Map<String, RepositoryDispatchEntity>> left = Mono.fromSupplier(() -> {
				if (team == null) {
					return this.repository.findByUsernameAndTeamIsNull(username);
				} else {
					return this.repository.findByTeamIn(Arrays.asList(team));
				}
			})
			.map(list -> list.stream().collect(Collectors.toMap(i -> i.getName(), i -> i)));

		Mono<Map<String, RepositoryDispatchEntity>> right = Flux.just(
				RepositoryDispatchEntity.of(username, name, team, eventType, clientPayload))
			.collectMap(s -> s.getName(), s -> s);

		return Mono.zip(left, right)
			.map(tuple -> merge(tuple.getT1(), tuple.getT2()))
			.doOnNext(userDispatch -> {
				log.debug("Saving user={} dispatch={}", username, userDispatch);
				this.repository.saveAll(userDispatch);
			})
			.then();
	}

	@RequestMapping(method = RequestMethod.DELETE)
	public Mono<Void> deleteDispatch(@AuthenticationPrincipal OAuth2User oauth2User, @RequestParam("name") String name,
			@RequestParam(name = "team", required = false) String team) {
		log.debug("Deleting dispatch request {} {}", name, team);
		String username = oauth2User.getName();
		return Mono.defer(() -> {
			RepositoryDispatchEntity entity = team != null
				? repository.findByUsernameAndNameAndTeamIsNull(username, name)
				: repository.findByTeamAndName(team, name);
			return Mono.justOrEmpty(entity)
				.doOnNext(dispatch -> {
					repository.delete(dispatch);
				})
				.then();
		});
		// return Mono.justOrEmpty(repository.findByUsernameAndNameAndTeamIsNull(username, name))
		// 	.doOnNext(dispatch -> {
		// 		repository.delete(dispatch);
		// 	})
		// 	.then();
	}

	@RequestMapping(method = RequestMethod.PATCH)
	public Mono<Void> changeDispatch(@AuthenticationPrincipal OAuth2User oauth2User, @RequestParam("name") String name,
			@RequestParam(name = "team", required = false) String team, @RequestParam("eventType") String eventType,
			@RequestBody(required = false) String clientPayload) {
		log.debug("Deleting dispatch request {} {}", name, team);
		String username = oauth2User.getName();

		return Mono.justOrEmpty(repository.findByUsernameAndNameAndTeamIsNull(username, name))
			.doOnNext(dispatch -> {
				dispatch.setEventType(eventType);
				dispatch.setClientPayload(clientPayload);
				repository.save(dispatch);
			})
			.then();
	}

	private Map<String, Object> mapClientPayload(String payload) {
		if (!StringUtils.hasText(payload)) {
			return null;
		}
		try {
			TypeReference<HashMap<String, Object>> valueTypeRef = new TypeReference<HashMap<String, Object>>() {};
			return objectMapper.readValue(payload, valueTypeRef);
		} catch (Exception e) {
			throw new RuntimeException("Unable to convert client payload", e);
		}
	}

	private List<RepositoryDispatchEntity> merge(Map<String, RepositoryDispatchEntity> left, Map<String, RepositoryDispatchEntity> right) {
		ArrayList<RepositoryDispatchEntity> out = new ArrayList<>();
		out.addAll(left.values());
		right.forEach((k, v) -> {
			RepositoryDispatchEntity us = left.get(k);
			if (us != null) {
				us.setName(v.getName());
				us.setTeam(v.getTeam());
				us.setEventType(v.getEventType());
				us.setClientPayload(v.getClientPayload());
			} else {
				us = RepositoryDispatchEntity.of(v.getUsername(), v.getName(), v.getTeam(), v.getEventType(), v.getClientPayload());
				out.add(us);
			}
		});
		return out;
	}
}
