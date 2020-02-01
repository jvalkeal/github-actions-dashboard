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
