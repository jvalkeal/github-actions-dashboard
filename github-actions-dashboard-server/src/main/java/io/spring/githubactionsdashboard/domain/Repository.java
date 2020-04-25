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

import io.spring.githubactionsdashboard.entity.RepositoryEntity;

/**
 * Domain class for repository.
 *
 * @author Janne Valkealahti
 */
public class Repository implements Comparable<Repository> {

	private String owner;
	private String name;
	private String title;
	private String url;
	private List<Branch> branches = new ArrayList<>();
	private List<PullRequest> pullRequests = new ArrayList<>();

	public Repository() {
	}

	public Repository(String owner, String name, String title, String url) {
		this.owner = owner;
		this.name = name;
		this.title = title;
		this.url = url;
	}

	public Repository(String owner, String name, String title, String url, List<Branch> branches, List<PullRequest> pullRequests) {
		this.owner = owner;
		this.name = name;
		this.title = title;
		this.url = url;
		if (branches != null) {
			this.branches = branches;
		}
		if (pullRequests != null) {
			this.pullRequests = pullRequests;
		}
	}

	public static Repository of(String owner, String name, String title, String url, List<Branch> branches, List<PullRequest> pullRequests) {
		return new Repository(owner, name, title, url, branches, pullRequests);
	}

	public static Repository of(String owner, String name, String title, String url) {
		return new Repository(owner, name, title, url);
	}

	public static Repository of(RepositoryEntity entity) {
		return new Repository(entity.getOwner(), entity.getRepository(), entity.getTitle(), null);
	}

	public Repository merge(Repository repository) {
		if (repository.getOwner() != null) {
			setOwner(repository.getOwner());
		}
		if (repository.getName() != null) {
			setName(repository.getName());
		}
		if (repository.getTitle() != null) {
			setTitle(repository.getTitle());
		}
		if (repository.getUrl() != null) {
			setUrl(repository.getUrl());
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

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
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
	public int compareTo(Repository o) {
		if (getName() == null || o.getName() == null) {
			return 0;
		} else {
			return getName().compareTo(o.getName());
		}
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((owner == null) ? 0 : owner.hashCode());
		result = prime * result + ((url == null) ? 0 : url.hashCode());
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
		if (url == null) {
			if (other.url != null)
				return false;
		} else if (!url.equals(other.url))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "Repository [branches=" + branches + ", name=" + name + ", owner=" + owner + ", title=" + title
				+ ", pullRequests=" + pullRequests + ", url=" + url + "]";
	}
}
