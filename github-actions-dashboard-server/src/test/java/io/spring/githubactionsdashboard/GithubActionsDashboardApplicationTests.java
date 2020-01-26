package io.spring.githubactionsdashboard;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = { "spring.security.oauth2.client.registration.github.client-id=fake",
		"spring.security.oauth2.client.registration.github.client-secret=fake" })
class GithubActionsDashboardApplicationTests {

	@Test
	void contextLoads() {
	}

}
