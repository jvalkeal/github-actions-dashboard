package io.spring.githubactionsdashboard;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import reactor.core.publisher.Mono;

@Controller
@RequestMapping("/api")
public class GithubController {

	@RequestMapping(path = "/hi", produces = MediaType.TEXT_PLAIN_VALUE)
	@ResponseBody
	public Mono<String> hi() {
		return Mono.just("hi");
	}
}
