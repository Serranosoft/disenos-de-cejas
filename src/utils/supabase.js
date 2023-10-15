import { supabase } from '../supabaseClient';

export async function fetchCategories(setter) {
    const { data } = await supabase.from("Categories").select("id, name, steps, bucket, image");
    setter(data);
}