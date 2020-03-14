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
	private DashboardRepository dashboardRepository;

	@Test
	public void testDashboards() {
		RepositoryEntity repository = new RepositoryEntity("owner1", "repository1", new HashSet<>(Arrays.asList("master")));
		Set<RepositoryEntity> repositories = new HashSet<>(Arrays.asList(repository));
		DashboardEntity dashboard = new DashboardEntity("name1", "description1", repositories);
		dashboardRepository.save(dashboard);


		List<DashboardEntity> dashboards = StreamSupport.stream(dashboardRepository.findAll().spliterator(), false)
				.collect(Collectors.toList());
		assertThat(dashboards).hasSize(1);

		repository = new RepositoryEntity("owner2", "repository2", new HashSet<>(Arrays.asList("dev")));
		repositories = new HashSet<>(Arrays.asList(repository));
		dashboard = new DashboardEntity("name2", "description2", repositories);
		dashboardRepository.save(dashboard);

		dashboards = StreamSupport.stream(dashboardRepository.findAll().spliterator(), false).collect(Collectors.toList());
		assertThat(dashboards).hasSize(2);
	}
}
