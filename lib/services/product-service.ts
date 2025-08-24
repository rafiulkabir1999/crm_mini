import fetchInstance from "./fetchinstance";

class ProductService {
    async createProduct  (formData: FormData) : Promise<any> {
  const res = await fetchInstance.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data", 
    },
  });
  return res.data;
};
}


export const productservice = new ProductService()