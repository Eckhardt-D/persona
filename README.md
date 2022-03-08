# Persona

One public profile to rule them all. By developers for developers.

## Description

Persona was developed for the [dev.to](https://dev.to/devteam/hack-the-microsoft-azure-trial-on-dev-2ne5) Microsoft Azure hackathon. It's a mono-repo TypeScript project featuring many things like GitHub OAuth, Mono Repo architecture, Database Management, API servers, Full-Stack Modern JS framework apps, complicated networking concepts through allowing users to point their own domains to a DNS and view their public profile on it.

## Features

- [Microsoft Azure VM](https://azure.microsoft.com/en-us/services/virtual-machines/)
- [Caddy auto HTTPS and reverse proxying](https://caddyserver.com/docs/automatic-https)
- [Nuxt.js and TypeScript](https://nuxtjs.org)
- [SQlite Database with Sequelize Migrations](https://sequelize.org/master/manual/migrations.html)
- [Github Oauth](https://github.com)
- [Fastify REST API](https://fastify.io)
- [Express static site server](https://expressjs.com)

## How the app works

You access the app at https://azure.kaizen.com.na. Here you can authorize the application with GitHub to create a base profile.

### Add a custom domain

The input to add a custom domain e.g. `profile.example.com` will allow you to save a custom domain to your profile, once you CNAME this domain to `dns-azure.kaizen.com.na`, your public profile will be accessible there. (by default it's accessible by `https://static-azure.kaizen.com.na/<your-user-id>`, which is accessible on your dashboard).

### Update your profile

Currently you can update your:

- Name, that will be displayed on your public page
- Bio (Markdown enabled), which can be previewed by click the 'toggle preview' button when in 'edit mode'
- Website (not currently used in public)
- Profile Image, You can upload a new profile image in edit mode (defaults to your github image). This is shown on your public page.

Note: The markdown editor doesn't support full markdown features. For security reasons and not having the time to do proper sanitisations I've disabled html.

# Developer Notes

The code is pretty much reusable outside of some things:

- Hard coded url values e.g. `https://azure.kaizen.com.na`: you'll have to update these to yours.
- ENV variables: I have left some `.env.dist` files where necessary so you know what is required to run the app.

```bash
git clone https://github.com/Eckhardt-D/persona.git
```

```bash
yarn install
```

```bash
yarn dev
```

```bash
yarn build && yarn start # production instances
```

Note: The `VM` runs on Caddy. This allows for easy config on auto-https and reverse proxying, install [Caddy](https://caddyserver.com) on your VM and edit your Caddyfile to this (just update the hard coded domains to your own and make sure they point to your instance IP):

```Caddyfile
{
    on_demand_tls {
        ask      http://localhost:3002/domain/verify
        interval 2m
        burst    5
    }
}

https:// {
  tls {
    on_demand
  }

  reverse_proxy {
    to http://localhost:3001
    header_up Host {upstream_hostport}
    header_up X-Forwarded-For {host}
  }
}

azure.kaizen.com.na {
  tls internal
  reverse_proxy http://localhost:3000
}

api-azure.kaizen.com.na {
  tls internal
  reverse_proxy http://localhost:3002
}

static-azure.kaizen.com.na {
  tls internal
  reverse_proxy {
    to http://localhost:3001
    header_up Host {upstream_hostport}
    header_up X-Forwarded-For static-azure
  }
}
```

As simple as that, the monorepo was setup with DX in mind. Although there could be some nuances that'll have to be referred to by opening an issue to this. Hope you enjoy it and feel free to contribute.
