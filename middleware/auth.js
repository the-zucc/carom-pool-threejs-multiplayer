// If it's a private page and there's no payload, redirect.
export default function(context) {
  const { store, redirect, route } = context;
  const { auth } = store.state;

  if (route.name != 'login' && !auth.payload) {
    return redirect("/login");
  }
}
