package io.spring.githubactionsdashboard;

import com.apollographql.apollo.ApolloCall;
import com.apollographql.apollo.api.Response;
import com.apollographql.apollo.exception.ApolloException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import reactor.core.publisher.Mono;

public class ReactorApollo {

	private final static Logger logger = LoggerFactory.getLogger(ReactorApollo.class);

	public static <T> Mono<Response<T>> from(final ApolloCall<T> call) {
		return Mono.create(sink -> {
			call.enqueue(new ApolloCall.Callback<T>() {

				@Override
				public void onResponse(Response<T> response) {
					logger.info("DDD1 {}", response);
					if (response.hasErrors()) {
						sink.error(new RuntimeException(
								response.errors().stream().map(e -> e.toString()).reduce("", String::concat)));
					} else {
						sink.success(response);
					}
				}

				@Override
				public void onFailure(ApolloException e) {
					logger.info("DDD2 {}", e);
					sink.error(e);
				}
			});
			sink.onDispose(() -> {
				logger.info("DDD3");
				call.cancel();
			});
		});
	}
}