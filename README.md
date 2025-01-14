<h1 align="center">Projeto E-commerce G3 - MATE85</h1>

<p align="center">Um simples projeto backend inicial de E-commerce utilizando NextJS Framework para demonstração da disciplina MATE85 - Tópicos em Sistemas de Informação e Web I.</p>

![Badge](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Badge](https://img.shields.io/badge/-ReactJs-61DAFB?logo=react&logoColor=white&style=for-the-badge)

Este projeto rosa usando [Next.js](https://nextjs.org/) e foi criado usando o [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

[Milestones](https://github.com/Murphyly/mate85_ecommerce/milestones): contém o cornograma e calendário desse projet

[Gerenciamento do Projeto](https://github.com/users/Murphyly/projects/1/views/5)

[Discussóes de Tecnologia](https://docs.google.com/document/d/1tNxArLmMkERyDy5abB3Fn9LJSFUgh1vAFx1bBVsxzfc/edit?usp=drive_link)

[Requisitos do Sistema](https://github.com/Murphyly/mate85_ecommerce/wiki/System-requirements)

[Documento de Arquitetura](https://github.com/Murphyly/mate85_ecommerce/wiki/Arquitetura)

[Versáo temporária](https://mate85-ecommerce.vercel.app/)

=======
## Tecnologias

As tecnologias que serão usadas nesse projeto são:

- [Next.js](https://nextjs.org/) - como nosso metaframework que contém um backend robusto, além de permitir SSR e outra funções usando React
- Postgres SQL (running at [Neon](https://neon.tech/) - como nossa database, mas provavelmente será migrado para o Firebase
- [Prisma](https://www.prisma.io/) - será o nosso ORM que serve como uma camada de abstração entre a aplicação e o dados persistentes
- Rodando [React](https://react.dev/) como nosso framework frontend em cima do Next.js
- [Tailwind CSS](https://tailwindcss.com/) para ser usado em conjunto com o React


=======
## Instalação

[Documento de Implantação](https://docs.google.com/document/d/1Yr--gvuf386FL-F-WLO3v_urGDBHwNXfvZdLlROPYGA/edit)
### Os passos abaixo estão desuatalizados e serão atualizados assim que recebermos um feedback no nosso documento

Depois de clonar este repositório, você precisa rodar o passo de instalção

```
npm install
```

O próximo passo é criar um arquivo `.env` no diretório raiz deste projeto vai conter a informação da conexão com o banco. Nos passos seguintes, substituir o `USERNAME` e `PASSWORD` pelos dados de autenticação.

```
DATABASE_URL=postgres://USERNAME:PASSWORD@localhost:5432
```

Se você não tiver uma instância Postgres rodando localmente, você pode criar uma em um provedor gratuito como o [Neon](https://neon.tech/) ou outro similar.
 
```
DATABASE_URL=postgres://USERNAME:PASSWORD@XXX.neon.tech/neondb?pgbouncer=true&connect_timeout=10
DIRECT_URL=postgres://USERNAME:PASSWORD@XXX.neon.tech/neondb?connect_timeout=10
```

Para certos provedores, como o Neon, uma `shadow dabtabase` é necessária para o Prisma rodar as migrações, portanto adicionar a linha abaixo no final do arquivo `.env`

```
SHADOW_DATABASE_URL=postgres://USERNAME:PASSWORD@XXX.neon.tech/shadow?pgbouncer=true&connect_timeout=10
```

Depois de linkar o banco, basta rodar o script de pós instalação


```
npm run post-install
```

=======
## Desenvolvimento

Para rodar o Next.js em modo de desenvolvimento, basta rodar o seguinte comendo.

```
bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Em seguida, abra [http://localhost:3000](http://localhost:3000) com o seu navegador.

=======
## Obervações

Este projeto usa [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) para automaticamente otimizar e carregar Inter, uma font custom do Google Font.
