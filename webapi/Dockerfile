# Specify the base image
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app

# Expose the port your application will listen to
EXPOSE 8080

# Set environment variable to production
ENV ASPNETCORE_ENVIRONMENT=Production

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

# Copy and restore dependencies
COPY ["webapi.csproj", "./"]
RUN dotnet restore "webapi.csproj"

# Copy everything else and build
COPY . . 
WORKDIR "/src"
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish . 

# Ensure your app listens on port 8080 (or the appropriate port)
ENV ASPNETCORE_URLS=http://+:8080

# Run the application
ENTRYPOINT ["dotnet", "webapi.dll"]
