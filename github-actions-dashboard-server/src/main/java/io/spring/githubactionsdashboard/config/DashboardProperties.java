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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Application properies under {@code dashboard} key.
 *
 * @author Janne Valkealahti
 */
@ConfigurationProperties(prefix = "dashboard")
public class DashboardProperties {

	private List<View> views = new ArrayList<>();

	public List<View> getViews() {
		return views;
	}

	public void setViews(List<View> views) {
		this.views = views;
	}

	public static class View {

		private String name;
		private String description;
		private List<Workflow> workflows = new ArrayList<>();

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

		public String getDescription() {
			return description;
		}

		public void setDescription(String description) {
			this.description = description;
		}

		public List<Workflow> getWorkflows() {
			return workflows;
		}

		public void setWorkflows(List<Workflow> workflows) {
			this.workflows = workflows;
		}
	}

	public static class Workflow {

		private String owner;
		private String name;
		private String title;
		private List<String> branches = new ArrayList<>(Arrays.asList("master"));
		private List<Dispatch> dispatches = new ArrayList<>();

		public String getOwner() {
			return owner;
		}

		public void setOwner(String owner) {
			this.owner = owner;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

		public String getTitle() {
			return title;
		}

		public void setTitle(String title) {
			this.title = title;
		}

		public List<String> getBranches() {
			return branches;
		}

		public void setBranches(List<String> branches) {
			this.branches = branches;
		}

		public List<Dispatch> getDispatches() {
			return dispatches;
		}

		public void setDispatches(List<Dispatch> dispatches) {
			this.dispatches = dispatches;
		}
	}

	public static class Dispatch {

		private String name;
		private String eventType;
		private Map<String, Object> clientPayload;

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

		public String getEventType() {
			return eventType;
		}

		public void setEventType(String eventType) {
			this.eventType = eventType;
		}

		public Map<String, Object> getClientPayload() {
			return clientPayload;
		}

		public void setClientPayload(Map<String, Object> clientPayload) {
			this.clientPayload = clientPayload;
		}
	}
}
