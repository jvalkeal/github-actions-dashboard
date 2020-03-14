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
package io.spring.githubactionsdashboard.config;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.core.env.StandardEnvironment;
import org.springframework.core.env.SystemEnvironmentPropertySource;

public class DashboardPropertiesTests {

	private final ApplicationContextRunner contextRunner = new ApplicationContextRunner();

	@Test
	public void oneViewOneWorkflowNoBranchesSet() {
		this.contextRunner
			.withInitializer(context -> {
				Map<String, Object> map = new HashMap<>();
				map.put("dashboard.views[0].workflows[0].owner", "owner0");
				map.put("dashboard.views[0].workflows[0].name", "name0");
				context.getEnvironment().getPropertySources().addLast(new SystemEnvironmentPropertySource(
					StandardEnvironment.SYSTEM_ENVIRONMENT_PROPERTY_SOURCE_NAME, map));
			})
			.withUserConfiguration(Config1.class)
			.run((context) -> {
				DashboardProperties properties = context.getBean(DashboardProperties.class);
				assertThat(properties.getViews()).isNotNull();
				assertThat(properties.getViews()).hasSize(1);
				assertThat(properties.getViews().get(0).getWorkflows()).isNotNull();
				assertThat(properties.getViews().get(0).getWorkflows()).hasSize(1);
				assertThat(properties.getViews().get(0).getWorkflows().get(0).getOwner()).isEqualTo("owner0");
				assertThat(properties.getViews().get(0).getWorkflows().get(0).getName()).isEqualTo("name0");
				assertThat(properties.getViews().get(0).getWorkflows().get(0).getBranches()).hasSize(1);
				assertThat(properties.getViews().get(0).getWorkflows().get(0).getBranches().get(0)).isEqualTo("master");
			});
	}

	@EnableConfigurationProperties({ DashboardProperties.class })
	private static class Config1 {
	}
}
