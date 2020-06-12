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
package io.spring.githubactionsdashboard.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "repository_dispatch")
public class RepositoryDispatchEntity extends AbstractUserEntity {

	@Column(name = "name")
	private String name;

	@Column(name = "event_type")
	private String eventType;

	@Column(name = "client_payload")
	private String clientPayload;

	public RepositoryDispatchEntity() {
	}

	public RepositoryDispatchEntity(String username, String name, String eventType, String clientPayload) {
		super(username);
		this.name = name;
		this.eventType = eventType;
		this.clientPayload = clientPayload;
	}

	public static RepositoryDispatchEntity of(String username, String name, String eventType, String clientPayload) {
		return new RepositoryDispatchEntity(username, name, eventType, clientPayload);
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

	public String getClientPayload() {
		return clientPayload;
	}

	public void setClientPayload(String clientPayload) {
		this.clientPayload = clientPayload;
	}

	@Override
	public String toString() {
		return "RepositoryDispatchEntity [clientPayload=" + clientPayload + ", eventType=" + eventType + ", name="
				+ name + "]";
	}
}
