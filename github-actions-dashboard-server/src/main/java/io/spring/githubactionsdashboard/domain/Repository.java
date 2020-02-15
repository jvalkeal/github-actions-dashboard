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

import java.util.ArrayList;
import java.util.List;

/**
 * Domain class for repository.
 *
 * @author Janne Valkealahti
 *
 */
public class Repository {

	private String owner;
	private String name;
	private List<Branch> branches = new ArrayList<>();
	private List<PullRequest> pullRequests = new ArrayList<>();

	public Repository() {
	}

	public Repository(String owner, String name) {
		this.owner = owner;
		this.name = name;
	}

	public Repository(String owner, String name, List<Branch> branches, List<PullRequest> pullRequests) {
		this.owner = owner;
		this.name = name;
		if (branches != null) {
			this.branches = branches;
		}
		if (pullRequests != null) {
			this.pullRequests = pullRequests;
		}
	}

	public static Repository of(String owner, String name, List<Branch> branches, List<PullRequest> pullRequests) {
		return new Repository(owner, name, branches, pullRequests);
	}

	public static Repository of(String owner, String name) {
		return new Repository(owner, name);
	}

	public Repository merge(Repository repository) {
		if (repository.getOwner() != null) {
			setOwner(repository.getOwner());
		}
		if (repository.getName() != null) {
			setName(repository.getName());
		}
		getBranches().addAll(repository.getBranches());
		getPullRequests().addAll(repository.getPullRequests());
		return this;
	}

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

	public List<Branch> getBranches() {
		return branches;
	}

	public void setBranches(List<Branch> branches) {
		this.branches = branches;
	}

	public List<PullRequest> getPullRequests() {
		return pullRequests;
	}

	public void setPullRequests(List<PullRequest> pullRequests) {
		this.pullRequests = pullRequests;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((owner == null) ? 0 : owner.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Repository other = (Repository) obj;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		if (owner == null) {
			if (other.owner != null)
				return false;
		} else if (!owner.equals(other.owner))
			return false;
		return true;
	}


}
