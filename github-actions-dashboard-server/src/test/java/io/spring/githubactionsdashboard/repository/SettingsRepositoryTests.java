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
package io.spring.githubactionsdashboard.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import io.spring.githubactionsdashboard.domain.Setting;
import io.spring.githubactionsdashboard.entity.UserSetting;

@DataJpaTest
public class SettingsRepositoryTests {

	@Autowired
	private TestEntityManager entityManager;

	@Autowired
	private SettingsRepository repository;

	@Test
	public void testSettings() {
		UserSetting setting = UserSetting.of("user1", Setting.of("key1", "value1"));
		entityManager.persist(setting);

		List<UserSetting> settings = StreamSupport.stream(repository.findAll().spliterator(), false)
				.collect(Collectors.toList());
		assertThat(settings).hasSize(1);

		setting = UserSetting.of("user2", Setting.of("key1", "value1"));
		repository.save(setting);

		settings = StreamSupport.stream(repository.findAll().spliterator(), false).collect(Collectors.toList());
		assertThat(settings).hasSize(2);
	}
}
