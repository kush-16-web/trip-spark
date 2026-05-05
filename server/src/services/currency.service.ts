import { env } from "../config/env";

export const exchangeRates = async (base: string, target: string): Promise<number> =>{
    try{
         const url = `https://v6.exchangerate-api.com/v6/${env.EXCHANGE_RATE_API_KEY}/pair/${base}/${target}`;
         const response = await fetch(url);

         const data = await response.json();

         if(data.result === 'success'){
            return data.conversion_rate;
         } 
         return 1;//Default to 1 if API fails 
    }catch(error){
        console.error("Currency API Error:", error);
        return 1;
    }
}