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
package io.spring.githubactionsdashboard.utils;

import com.apollographql.apollo.ApolloCall;
import com.apollographql.apollo.api.Response;
import com.apollographql.apollo.exception.ApolloException;

import reactor.core.publisher.Mono;

public class ReactorApollo {

	public static <T> Mono<Response<T>> from(final ApolloCall<T> call) {
		return Mono.create(sink -> {
			call.enqueue(new ApolloCall.Callback<T>() {

				@Override
				public void onResponse(Response<T> response) {
					if (response.hasErrors()) {
						sink.error(new RuntimeException(
								response.errors().stream().map(e -> e.toString()).reduce("", String::concat)));
					} else {
						sink.success(response);
					}
				}

				@Override
				public void onFailure(ApolloException e) {
					sink.error(e);
				}
			});
			sink.onDispose(() -> {
				call.cancel();
			});
		});
	}
}
