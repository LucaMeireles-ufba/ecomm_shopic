"use server";
import { prisma } from "@/utils/prisma"
import { CreateProductCategory } from "./action";
import { AdminForm } from "@/components/admin/adminForm";

export default async function AddEditCategories() {
  const fields = [
    {
      name: "categoryName",
      label: "Categoria",
      type: "text",
    },
  ];

  return (
    <div className="flex justify-center w-full items-center">
      <AdminForm
        formTitle="Adicionar Categoria"
        action={CreateProductCategory}
        fields={fields}
        buttonLabel="Criar Categoria"
      />
    </div>
  );
}

// import { Button } from "@/components/ui/button";
// //import { prisma } from "@/utils/prisma";
// import { prisma } from "@/utils/prisma";
// import Link from "next/link";
// import { UpdateProductCategory } from "./UpdateProductCategory";
// import { CreateProductCategory } from "./CreateProductCategory";

// export default async function Categorias() {
//   const categorias = await prisma.productCategory.findMany();

//   return (
//     <div>
//       <h1>Lista de Categorias</h1>

//       {categorias.map((categoria) => {
//         return (
//           <div key={categoria.id}>
//             <Link href={`/productCategory/${categoria.id}`}>
//               {categoria.nome}
//             </Link>
//           </div>
//         );
//       })}

//       <CreateProductCategory></CreateProductCategory>

//       <UpdateProductCategory></UpdateProductCategory>
//     </div>
//   );
// }


// import { Button } from "@/components/ui/button";
// import { asyncCreateProductCategory } from "./action";

// export function CreateProductCategory() {
//   return (
//     <form action={asyncCreateProductCategory}>
//       <h2>Nova Categoria</h2>
//       <input type="text" name="nome" placeholder="Categoria" />
//       <Button>Criar</Button>
//     </form>
//   );
// }

