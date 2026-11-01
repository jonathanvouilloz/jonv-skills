# JVM (Spring Boot, Quarkus, Kotlin)

Lire aussi `orm.md` (section Hibernate/JPA).

## Spring Boot

**Base et transactions**
- **Open Session in View** : `spring.jpa.open-in-view` vaut `true` par défaut (Spring Boot affiche un avertissement au démarrage). La session reste ouverte pendant le rendu de la réponse : chargements paresseux tardifs (N+1 dans la sérialisation JSON) et connexion tenue plus longtemps. Recommander `false` avec chargement explicite.
- HikariCP : `maximumPoolSize` 10 par défaut, `connectionTimeout` 30 s. Vérifier la cohérence avec le nombre d'instances et `max_connections`.
- `@Transactional` sur des méthodes qui appellent des services externes ; `@Transactional(readOnly = true)` absent sur les lectures.
- Timeout de requête : `spring.jpa.properties.jakarta.persistence.query.timeout` ou `@Transactional(timeout = …)`.

**Threads**
- Modèle classique (Tomcat, 200 threads par défaut) : une I/O lente bloque un thread.
- Threads virtuels (Java 21+, `spring.threads.virtual.enabled=true`) : beaucoup plus de requêtes simultanées, donc **le pool de connexions devient le goulot**. Vérifier la taille du pool et les timeouts si les threads virtuels sont activés.
- WebFlux : appel bloquant (JDBC, `RestTemplate`) dans un flux réactif = blocage de l'event loop Netty.

**HTTP sortant** : `RestTemplate`/`RestClient`/`WebClient` sans timeouts de connexion et de lecture.

**Cache** : `@Cacheable` sans TTL ni éviction (Caffeine/Redis à configurer), ou appelé depuis la même classe (le proxy ne s'applique pas).

**Travail asynchrone** : `@Async` sans exécuteur configuré ; file (RabbitMQ, Kafka, base) pour les traitements lourds.

**Mesurer** : Actuator + Micrometer (`http.server.requests`, `hikaricp.connections.pending`), OpenTelemetry Java agent, datasource-proxy ou p6spy pour compter les requêtes.

## Quarkus

- Panache : mêmes risques N+1 qu'Hibernate ; `@Blocking` vs réactif selon le modèle.
- Agroal (pool) : `quarkus.datasource.jdbc.max-size`, `acquisition-timeout`.

## Démarrage et mémoire

- Taille de heap adaptée au conteneur (`-XX:MaxRAMPercentage`), GC par défaut (G1) suffisant pour une app métier.
- Démarrage lent : pertinent seulement en serverless ou en autoscaling agressif (CDS, AOT, GraalVM native).
