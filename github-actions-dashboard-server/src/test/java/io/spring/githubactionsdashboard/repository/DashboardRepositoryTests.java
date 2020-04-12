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
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import io.spring.githubactionsdashboard.entity.DashboardEntity;
import io.spring.githubactionsdashboard.entity.RepositoryEntity;

@DataJpaTest
public class DashboardRepositoryTests {

	@Autowired
	private DashboardRepository repository;

	@Test
	public void testDashboards() {
		RepositoryEntity repositoryEntity = new RepositoryEntity("owner1", "repository1", new HashSet<>(Arrays.asList("master")));
		Set<RepositoryEntity> repositoryEntities = new HashSet<>(Arrays.asList(repositoryEntity));
		DashboardEntity dashboardEntity = new DashboardEntity("name1", "description1", repositoryEntities);
		dashboardEntity.setUsername("user1");
		repository.save(dashboardEntity);

		List<DashboardEntity> dashboardEntities = StreamSupport.stream(repository.findAll().spliterator(), false)
				.collect(Collectors.toList());
		assertThat(dashboardEntities).hasSize(1);

		repositoryEntity = new RepositoryEntity("owner2", "repository2", new HashSet<>(Arrays.asList("dev")));
		repositoryEntities = new HashSet<>(Arrays.asList(repositoryEntity));
		dashboardEntity = new DashboardEntity("name2", "description2", repositoryEntities);
		dashboardEntity.setUsername("user1");
		repository.save(dashboardEntity);

		dashboardEntities = StreamSupport.stream(repository.findAll().spliterator(), false).collect(Collectors.toList());
		assertThat(dashboardEntities).hasSize(2);

		assertThat(repository.findByUsername("user1")).hasSize(2);
		assertThat(repository.findByUsernameAndName("user1", "name1")).isNotNull();
		assertThat(repository.findByUsernameAndName("user1", "name2")).isNotNull();
		assertThat(repository.findByUsernameAndName("user1", "name3")).isNull();
	}
}
