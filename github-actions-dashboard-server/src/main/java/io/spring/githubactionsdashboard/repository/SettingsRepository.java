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
import io.spring.githubactionsdashboard.entity.UserSetting;

/**
 * Repository to store user settings as a simple name/value pairs.
 *
 * @author Janne Valkealahti
 *
 */
public interface SettingsRepository extends CrudRepository<UserSetting, Long> {

    /**
     * Gets a list of user settings.
     *
     * @param username the username
     * @return list of user settings
     */
    List<UserSetting> findByUsername(String username);
}
