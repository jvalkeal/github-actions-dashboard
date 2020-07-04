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

import java.util.Collection;
import java.util.List;

import org.springframework.data.repository.CrudRepository;

import io.spring.githubactionsdashboard.entity.DashboardEntity;

public interface DashboardRepository extends CrudRepository<DashboardEntity, Long> {

	/**
	 * Gets all user dashboards.
	 *
	 * @param username the username
	 * @return list of user dashboards
	 */
	List<DashboardEntity> findByUsernameAndTeamIsNull(String username);

	/**
	 * Get a user dashboard by its name.
	 *
	 * @param username the username
	 * @param name the name
	 * @return user dashboard
	 */
	DashboardEntity findByUsernameAndName(String username, String name);

	/**
	 * Get dashboard by team id's.
	 *
	 * @param teams the team id's
	 * @return list of team dashboards
	 */
	List<DashboardEntity> findByTeamIn(Collection<String> teams);

	/**
	 * Get dashboard by team and name.
	 *
	 * @param team the team name
	 * @param name the dashboard name
	 * @return team dashboard
	 */
	DashboardEntity findByTeamAndName(String team, String name);
}
