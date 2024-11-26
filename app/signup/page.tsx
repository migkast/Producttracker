// Add error handling for signup
async function onSubmit(values: z.infer<typeof formSchema>) {
  try {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      throw error;
    }

    toast({
      title: "Success",
      description: "Please check your email to confirm your account.",
    });

    router.push("/login");
  } catch (error: any) {
    toast({
      title: "Error",
      description: error?.message || "Something went wrong. Please try again.",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
}