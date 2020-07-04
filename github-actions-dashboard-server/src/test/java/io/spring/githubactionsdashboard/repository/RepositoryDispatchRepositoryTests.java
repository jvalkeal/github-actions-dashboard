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

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import io.spring.githubactionsdashboard.entity.RepositoryDispatchEntity;

@DataJpaTest
public class RepositoryDispatchRepositoryTests {

	@Autowired
	private RepositoryDispatchRepository repository;

	@Test
	public void testUserTemplates() {
		RepositoryDispatchEntity entity1 = new RepositoryDispatchEntity("user1", "template1", null, "type1", "payload1");
		repository.save(entity1);

		List<RepositoryDispatchEntity> entities1 = StreamSupport.stream(repository.findAll().spliterator(), false)
				.collect(Collectors.toList());
		assertThat(entities1).hasSize(1);

		entities1 = StreamSupport.stream(repository.findByUsernameAndTeamIsNull("user1").spliterator(), false)
				.collect(Collectors.toList());
		assertThat(entities1).hasSize(1);

		RepositoryDispatchEntity entity = repository.findByUsernameAndNameAndTeamIsNull("user1", "template1");
		assertThat(entity).isNotNull();

		RepositoryDispatchEntity entity2 = new RepositoryDispatchEntity("user2", "template2", null, "type2", "payload2");
		repository.save(entity2);

		List<RepositoryDispatchEntity> entities2 = StreamSupport.stream(repository.findAll().spliterator(), false)
				.collect(Collectors.toList());
		assertThat(entities2).hasSize(2);

		assertThat(repository.findByUsernameAndTeamIsNull("user1")).hasSize(1);
		assertThat(repository.findByUsernameAndTeamIsNull("user2")).hasSize(1);
	}

	@Test
	public void testTeamTemplates() {
		RepositoryDispatchEntity entity1 = new RepositoryDispatchEntity("user1", "template1", "team1", "type1", "payload1");
		repository.save(entity1);

		RepositoryDispatchEntity entity = repository.findByTeamAndName("team1", "template1");
		assertThat(entity).isNotNull();

		List<RepositoryDispatchEntity> entities1 = StreamSupport.stream(repository.findByTeamIn(Arrays.asList("team1")).spliterator(), false)
				.collect(Collectors.toList());
		assertThat(entities1).hasSize(1);
	}
}
