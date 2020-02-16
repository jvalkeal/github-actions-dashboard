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

public class CheckRun {

	private String name;
	private String status;
	private String conclusion;
	private String url;

	public CheckRun() {
	}

	public CheckRun(String name, String status, String conclusion, String url) {
		this.name = name;
		this.status = status;
		this.conclusion = conclusion;
		this.url = url;
	}

	public static CheckRun of(String name, String status) {
		return new CheckRun(name, status, null, null);
	}

	public static CheckRun of(String name, String status, String conclusion, String url) {
		return new CheckRun(name, status, conclusion, url);
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getConclusion() {
		return conclusion;
	}

	public void setConclusion(String conclusion) {
		this.conclusion = conclusion;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}
}
