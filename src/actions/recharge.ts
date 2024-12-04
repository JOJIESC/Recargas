"use server";

export default async function recharge(formData: FormData) {
  //   const response = await fetch(`apiURL`, {
  //     method: "POST",
  //     body: formData,
  //   });
  //   console.log(await response.json());}
  let recharge: any = {};
  for (const key of formData.keys()) {
    if (!key.includes("$ACTION_ID")) {
      recharge[key] = formData.get(key);
    }
  }
  console.log(recharge);
}
