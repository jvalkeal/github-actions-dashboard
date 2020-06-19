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
package io.spring.githubactionsdashboard.domain;

import java.util.Map;

/**
 * Domain class for repo dispatch.
 *
 * @author Janne Valkealahti
 *
 */
public class RepositoryDispatch {

	private String name;
	private String eventType;
	private Map<String, Object> clientPayload;

	public RepositoryDispatch() {
	}

	public RepositoryDispatch(String name, String eventType, Map<String, Object> clientPayload) {
		this.name = name;
		this.eventType = eventType;
		this.clientPayload = clientPayload;
	}

	public static RepositoryDispatch of(String name, String eventType, Map<String, Object> clientPayload) {
		return new RepositoryDispatch(name, eventType, clientPayload);
	}

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

	@Override
	public String toString() {
		return "RepositoryDispatch [clientPayload=" + clientPayload + ", eventType=" + eventType + ", name=" + name
				+ "]";
	}
}
