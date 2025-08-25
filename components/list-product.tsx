"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  fetchDarazCategoryAttributes,
  generateProductListing,
  listDarazProduct,
} from "@/app/server";
import SideBar from "./sidebar";
import { Textarea } from "./ui/textarea";

export default function ListProduct({ categories }: { categories: any[] }) {
  const [categoryPath, setCategoryPath] = useState<any[]>([]); // all selected categories
  const [attributes, setAttributes] = useState<any[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiGenerated, setAiGenerated] = useState<{
    title?: string;
    description?: string;
  }>({});
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});

  const handleInputChange = (name: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = async (level: number, categoryId: string) => {
    const parentCats =
      level === 0 ? categories : categoryPath[level - 1].children;
    const category = parentCats.find(
      (c: any) => String(c.category_id) === categoryId
    );

    if (!category) return;

    // Trim the path if user changes a higher-level selection
    const newPath = [...categoryPath.slice(0, level), category];
    setCategoryPath(newPath);

    if (category.children && category.children.length > 0) {
      // More children, so wait for deeper selection
      setAttributes([]);
    } else {
      // Leaf node → fetch attributes
      try {
        const attrs = await fetchDarazCategoryAttributes(
          String(category.category_id)
        );
        const mandatoryAttrs = attrs.data?.filter(
          (attr: any) => attr.is_mandatory
        );
        console.log("Fetched Mandatory Attributes:", mandatoryAttrs);
        setAttributes(mandatoryAttrs || []);
      } catch (err) {
        console.error("Failed to fetch attributes", err);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const renderCategorySelect = (cats: any[], level: number) => (
    <Select
      onValueChange={(val) => handleCategoryChange(level, val)}
      value={
        categoryPath[level]?.category_id
          ? String(categoryPath[level].category_id)
          : ""
      }
    >
      <SelectTrigger>
        <SelectValue placeholder="Choose category" />
      </SelectTrigger>
      <SelectContent className="max-h-64 overflow-y-auto">
        {cats.map((cat) => (
          <SelectItem key={cat.category_id} value={String(cat.category_id)}>
            {cat.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const handleGenerateAIListing = async () => {
    if (!image) {
      alert("Please upload an image first!");
      return;
    }
    try {
      setLoadingAI(true);
      const res = await generateProductListing(
        // "50000701541aaPuenvdWTjYEhSgorvgGePh2evsCGwlxrARwpmS7x1369996b3",
        image
      );

      const listingData: { title: string; description: string } = res.data;
      console.log("Generated Listing Data:", listingData);

      setAiGenerated(listingData);
      setFormValues((prev) => ({
        ...prev,
        name: listingData.title,
        short_description: listingData.description,
        short_description_en: listingData.description.slice(0, 200),
        description: listingData.description,
        description_en: listingData.description,
      }));
    } catch (error) {
      console.error("AI Listing generation failed", error);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleListProduct = async () => {
    try {
      const payload = {
        PrimaryCategory: categoryPath[categoryPath.length - 1]?.category_id,
        Title: formValues["name"],
        Images: image ? [URL.createObjectURL(image)] : [],
        Attributes: formValues,
        Skus: [
          {
            SellerSku: "api-create-test-" + Date.now(),
            color_family: formValues.color_family || "Default",
            size: formValues.size || "Standard",
            quantity: formValues.quantity || 1,
            price: formValues.price || 100,
            package_length: formValues.package_length || 10,
            package_height: formValues.package_height || 10,
            package_weight: formValues.package_weight || 1,
            package_width: formValues.package_width || 10,
            package_content: formValues.package_content || "Box contents",
            Images: image ? [URL.createObjectURL(image)] : [],
          },
        ],
      };
      console.log(payload);
      const res = await listDarazProduct(
        "50000701541aaPuenvdWTjYEhSgorvgGePh2evsCGwlxrARwpmS7x1369996b3",
        payload,
        [image!]
      );
      console.log("Product Listed Successfully:", res);
      alert("Product listed successfully!");
    } catch (error) {
      console.error("Failed to list product on daraz", error);
    }
  };

  {
    loadingAI && (
      <div className="animate-pulse space-y-2">
        <div className="h-6 bg-slate-300 rounded w-2/3"></div>
        <div className="h-4 bg-slate-300 rounded w-full"></div>
        <div className="h-4 bg-slate-300 rounded w-5/6"></div>
      </div>
    );
  }

  return (
    <div className="flex">
      <SideBar />

      <main className="flex-1 ml-64 p-8 bg-slate-50 min-h-screen space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Product Listing</h1>
          <p className="text-slate-600 mt-2">
            List your products across all platforms.
          </p>
        </div>

        {/* Step 1: Upload Image */}
        <Card className="shadow-lg">
          <CardContent className="space-y-4">
            <Label htmlFor="image">Upload Product Image</Label>
            <Input type="file" accept="image/*" onChange={handleImageUpload} />
            {image && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="h-40 w-auto rounded-xl border"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Recursive Category Selection */}
        <Card className="shadow-lg">
          <CardContent className="space-y-4">
            <Label>Select Category</Label>
            {renderCategorySelect(categories, 0)}

            {categoryPath.map(
              (cat, idx) =>
                cat.children &&
                cat.children.length > 0 && (
                  <div key={cat.category_id} className="mt-4 space-y-2">
                    <Label>Select Subcategory</Label>
                    {renderCategorySelect(cat.children, idx + 1)}
                  </div>
                )
            )}
          </CardContent>
        </Card>

        {/* Step 3: Dynamic Attributes */}
        {/* Step 3: Dynamic Attributes */}
        {attributes.length > 0 && (
          <Card className="shadow-lg">
            <CardContent className="space-y-4">
              <div className="text-lg font-semibold flex items-center justify-between">
                <p>Product Details</p>
                <Button onClick={handleGenerateAIListing} disabled={loadingAI}>
                  {loadingAI ? "Generating..." : "Generate AI Listing"}
                </Button>
              </div>

              {/* 🔹 Show loading animation when AI is working */}
              {loadingAI ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-6 bg-slate-300 rounded w-2/3"></div>
                  <div className="h-4 bg-slate-300 rounded w-full"></div>
                  <div className="h-4 bg-slate-300 rounded w-5/6"></div>
                </div>
              ) : (
                attributes.map((attr) => (
                  <div key={attr.name} className="space-y-2">
                    <Label>{attr.label || attr.name}</Label>

                    {attr.input_type === "text" && (
                      <Input
                        name={attr.name}
                        placeholder={`Enter ${attr.label || attr.name}`}
                        // defaultValue={
                        //   attr.name.toLowerCase().includes("name") ||
                        //   attr.name.toLowerCase().includes("package_content")
                        //     ? aiGenerated.title
                        //     : ""
                        // }
                        // value={formValues[attr.name] || ""}
                        value={formValues[attr.name] || ""}
                        onChange={(e) =>
                          handleInputChange(attr.name, e.target.value)
                        }
                      />
                    )}

                    {attr.input_type === "richText" && (
                      <Textarea
                        name={attr.name}
                        placeholder={`Enter ${attr.label || attr.name}`}
                        // defaultValue={
                        //   attr.name.toLowerCase().includes("description")
                        //     ? aiGenerated.description
                        //     : ""
                        // }
                        // value={formValues[attr.name] || ""}
                        value={formValues[attr.name] || ""}
                        onChange={(e) =>
                          handleInputChange(attr.name, e.target.value)
                        }
                      />
                    )}

                    {attr.input_type === "numeric" && (
                      <Input
                        type="number"
                        name={attr.name}
                        placeholder={`Enter ${attr.label || attr.name}`}
                        value={formValues[attr.name] || ""}
                        onChange={(e) =>
                          handleInputChange(attr.name, e.target.value)
                        }
                      />
                    )}

                    {/* multiEnumInput */}
                    {attr.input_type === "multiEnumInput" && (
                      // <Select>
                      //   <SelectTrigger>
                      //     <SelectValue
                      //       placeholder={`Select ${attr.label || attr.name}`}
                      //     />
                      //   </SelectTrigger>
                      //   <SelectContent>
                      //     {attr.options?.map((opt: any, index: number) => (
                      //       <SelectItem
                      //         key={index}
                      //         value={opt.value || opt.name || String(opt)}
                      //       >
                      //         {opt.name || opt.value || String(opt)}
                      //       </SelectItem>
                      //     ))}
                      //   </SelectContent>
                      // </Select>
                      <Select
                        onValueChange={(val) =>
                          handleInputChange(attr.name, val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={`Select ${attr.label || attr.name}`}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {attr.options?.map((opt: any, index: number) => (
                            <SelectItem
                              key={index}
                              value={opt.value || opt.name || String(opt)}
                            >
                              {opt.name || opt.value || String(opt)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {attr.input_type === "singleSelect" && (
                      // <Select>
                      //   <SelectTrigger>
                      //     <SelectValue
                      //       placeholder={`Select ${attr.label || attr.name}`}
                      //     />
                      //   </SelectTrigger>
                      //   <SelectContent>
                      //     {attr.options?.map((opt: any, index: number) => (
                      //       <SelectItem
                      //         key={index}
                      //         value={opt.value || opt.name || String(opt)}
                      //       >
                      //         {opt.name || opt.value || String(opt)}
                      //       </SelectItem>
                      //     ))}
                      //   </SelectContent>
                      // </Select>
                      <Select
                        onValueChange={(val) =>
                          handleInputChange(attr.name, val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={`Select ${attr.label || attr.name}`}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {attr.options?.map((opt: any, index: number) => (
                            <SelectItem
                              key={index}
                              value={opt.value || opt.name || String(opt)}
                            >
                              {opt.name || opt.value || String(opt)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {attr.input_type === "multiSelect" && (
                      // <Select>
                      //   <SelectTrigger>
                      //     <SelectValue
                      //       placeholder={`Select ${attr.label || attr.name}`}
                      //     />
                      //   </SelectTrigger>
                      //   <SelectContent>
                      //     {attr.options?.map((opt: any, index: number) => (
                      //       <SelectItem
                      //         key={index}
                      //         value={opt.value || opt.name || String(opt)}
                      //       >
                      //         {opt.name || opt.value || String(opt)}
                      //       </SelectItem>
                      //     ))}
                      //   </SelectContent>
                      // </Select>
                      <Select
                        onValueChange={(val) =>
                          handleInputChange(attr.name, val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={`Select ${attr.label || attr.name}`}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {attr.options?.map((opt: any, index: number) => (
                            <SelectItem
                              key={index}
                              value={opt.value || opt.name || String(opt)}
                            >
                              {opt.name || opt.value || String(opt)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                ))
              )}

              <Button
                className="w-full mt-4"
                disabled={loadingAI}
                onClick={handleListProduct}
              >
                Submit Product
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
