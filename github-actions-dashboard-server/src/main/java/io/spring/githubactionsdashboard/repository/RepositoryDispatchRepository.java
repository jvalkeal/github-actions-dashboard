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

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import io.spring.githubactionsdashboard.entity.RepositoryDispatchEntity;

/**
 * Repository storing repo dispatch templates.
 *
 * @author Janne Valkealahti
 *
 */
public interface RepositoryDispatchRepository extends CrudRepository<RepositoryDispatchEntity, Long> {

	/**
	 * Gets all user dispatch templates.
	 *
	 * @param username the username
	 * @return list of user dispatch templates
	 */
	List<RepositoryDispatchEntity> findByUsername(String username);

	/**
	 * Get a user dispatch by name.
	 *
	 * @param username the username
	 * @param name the name
	 * @return user dispatch template
	 */
	RepositoryDispatchEntity findByUsernameAndName(String username, String name);
}
