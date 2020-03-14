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

import java.io.File;
import java.nio.file.Files;
import java.util.Arrays;
import java.util.EnumSet;
import java.util.List;

import javax.persistence.spi.PersistenceUnitInfo;

import org.hibernate.boot.MetadataSources;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.tool.hbm2ddl.SchemaExport;
import org.hibernate.tool.schema.TargetType;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.orm.jpa.hibernate.SpringImplicitNamingStrategy;
import org.springframework.boot.orm.jpa.hibernate.SpringPhysicalNamingStrategy;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;

/**
 * Not an actual test but simply writes ddl's into files for supported db's.
 * These files are helpfull to manually keep flyway schema files up to date.
 *
 * @author Janne Valkealahti
 */
@DataJpaTest
public class SchemaGenerationTests {

	private final static Logger log = LoggerFactory.getLogger(SchemaGenerationTests.class);

	@Autowired
	private LocalContainerEntityManagerFactoryBean fb;

	@Test
	public void generate() throws Exception {
		PersistenceUnitInfo persistenceUnitInfo = fb.getPersistenceUnitInfo();
		File tempDir = Files.createTempDirectory("dashboard-sql-").toFile();
		List<String> supportedHibernateDialects = Arrays.asList("H2", "MySQL5", "PostgreSQL94");
		log.info("Generating DDL scripts for the following dialects: {}", supportedHibernateDialects);
		supportedHibernateDialects.forEach(d -> {
			generateDdlFiles(d, tempDir, persistenceUnitInfo);
		});
		log.info("You can find the DDL scripts in directory: {}", tempDir.getAbsolutePath());
	}

	private void generateDdlFiles(String dialect, File tempDir, PersistenceUnitInfo persistenceUnitInfo) {
		log.info("Generating DDL script for {}", dialect);
		MetadataSources metadata = new MetadataSources(new StandardServiceRegistryBuilder()
				.applySetting("hibernate.dialect", "org.hibernate.dialect." + dialect + "Dialect")
				.applySetting("hibernate.physical_naming_strategy", SpringPhysicalNamingStrategy.class.getName())
				.applySetting("hibernate.implicit_naming_strategy", SpringImplicitNamingStrategy.class.getName())
				.build());
		persistenceUnitInfo.getManagedClassNames().forEach(clazz -> {
			log.info(clazz);
			metadata.addAnnotatedClassName(clazz);
		});
		SchemaExport export = new SchemaExport();
		export.setDelimiter(";");
		export.setFormat(true);
		export.setOutputFile(new File(tempDir, "schema-" + dialect.toLowerCase() + ".sql").getAbsolutePath());
		export.execute(EnumSet.of(TargetType.SCRIPT), SchemaExport.Action.BOTH, metadata.buildMetadata());
	}
}
