# .NET (ASP.NET Core, Blazor)

Lire aussi `orm.md` (section EF Core) et la référence de la base utilisée.

## Asynchrone et threads

- **Sync-over-async** : `.Result`, `.Wait()`, `.GetAwaiter().GetResult()` sur une tâche dans le code de requête → épuisement du thread pool sous charge (les requêtes attendent un thread libre). Constat de nature Blocage.
- Méthodes `async void` hors gestionnaires d'événements.
- I/O synchrones (`File.ReadAllText`, `Stream.Read`) dans les contrôleurs.
- `Task.WhenAll` sur une liste de taille variable qui interroge la base : même problème de concurrence non bornée que `Promise.all` (pool à 100 par défaut, `Timeout` d'acquisition 15 s).

## HTTP sortant

- `new HttpClient()` par requête → épuisement des sockets. Utiliser `IHttpClientFactory` ou un client partagé.
- Timeout par défaut de `HttpClient` : 100 s. Le fixer explicitement ; ajouter une politique de résilience (Polly / `Microsoft.Extensions.Http.Resilience`).

## EF Core et accès aux données

- `AddDbContextPool` plutôt que `AddDbContext` sur les API à fort trafic.
- `AsNoTracking`, projections, `AsSplitQuery`, `ExecuteUpdate`/`ExecuteDelete` : voir `orm.md`.
- Chaîne de connexion Npgsql / SqlClient : `Timeout` (connexion), `Command Timeout`, `Maximum Pool Size`. Vérifier qu'aucun n'est à 0.
- Dapper pour les requêtes de lecture critiques si EF génère un SQL sous-optimal (à proposer seulement avec un plan mesuré).

## Framework

- **Compression** : `AddResponseCompression` / `UseResponseCompression` ou au proxy (Kestrel derrière YARP, Nginx, IIS).
- **Cache** : Output Caching (`AddOutputCache`) pour les réponses partagées ; `HybridCache` (.NET 9+) ou `IMemoryCache`/`IDistributedCache` pour les données ; vérifier que la clé tient compte de l'utilisateur quand la donnée est personnelle.
- Travail lent → `BackgroundService` / `Channel<T>`, Hangfire, ou file externe.
- Sérialisation : `System.Text.Json` avec sources générées pour les DTO très utilisés.
- Logs : niveau `Information` sur EF Core en production = une ligne par requête SQL.
- **Blazor Server** : chaque utilisateur garde un circuit SignalR et de l'état en mémoire serveur ; composants qui rechargent tout à chaque rendu ; latence perçue à chaque interaction. **Blazor WebAssembly** : poids du téléchargement initial (vérifier trimming, compression, chargement paresseux d'assemblies).

## Mesurer

- `dotnet-counters` (thread pool queue length, requêtes/s, GC), `dotnet-trace`.
- OpenTelemetry (`AddOpenTelemetry().WithTracing(...)`) avec instrumentation ASP.NET Core, HttpClient et EF Core.
- BenchmarkDotNet seulement pour un point chaud déjà identifié.
