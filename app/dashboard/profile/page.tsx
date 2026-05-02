import { createClient } from "@/lib/supabase";
import { getProfile, updateProfile } from "@/actions/profile";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null; // Will be handled by middleware
  }

  const profile = await getProfile();

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-10 flex flex-col gap-8 flex-1">
      <h1 className="text-title-lg text-(--color-on-dark)">Profile Settings</h1>
      
      <div className="bg-(--color-surface-card-dark) rounded-xl border border-(--color-hairline-on-dark) p-6">
        <form action={updateProfile} className="flex flex-col gap-6">
          <div>
            <label className="block text-body-sm mb-1 text-(--color-muted)">Name</label>
            <input 
              type="text" 
              name="name" 
              defaultValue={profile?.name || ""} 
              className="w-full bg-(--color-canvas-dark) border border-(--color-hairline-on-dark) rounded-md px-3 py-2 text-body-md focus:border-(--color-primary) focus:outline-none text-(--color-on-dark)" 
              placeholder="Your Name" 
            />
          </div>

          <div>
            <label className="block text-body-sm mb-1 text-(--color-muted)">Email Address</label>
            <input 
              type="email" 
              name="email" 
              defaultValue={user.email || ""} 
              className="w-full bg-(--color-canvas-dark) border border-(--color-hairline-on-dark) rounded-md px-3 py-2 text-body-md focus:border-(--color-primary) focus:outline-none text-(--color-on-dark)" 
              placeholder="Email" 
            />
          </div>

          <div>
            <label className="block text-body-sm mb-1 text-(--color-muted)">New Password (leave blank to keep current)</label>
            <input 
              type="password" 
              name="password" 
              className="w-full bg-(--color-canvas-dark) border border-(--color-hairline-on-dark) rounded-md px-3 py-2 text-body-md focus:border-(--color-primary) focus:outline-none text-(--color-on-dark)" 
              placeholder="••••••••" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-body-sm mb-1 text-(--color-muted)">Currency</label>
              <select 
                name="currency" 
                defaultValue={profile?.currency || "USD"}
                className="w-full bg-(--color-canvas-dark) border border-(--color-hairline-on-dark) rounded-md px-3 py-2 text-body-md focus:border-(--color-primary) focus:outline-none text-(--color-on-dark)"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="PKR">PKR (Rs)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-body-sm mb-1 text-(--color-muted)">Theme</label>
              <select 
                name="theme" 
                defaultValue={profile?.theme || "dark"}
                className="w-full bg-(--color-canvas-dark) border border-(--color-hairline-on-dark) rounded-md px-3 py-2 text-body-md focus:border-(--color-primary) focus:outline-none text-(--color-on-dark)"
              >
                <option value="dark">Dark Theme</option>
                <option value="light">Light Theme</option>
                <option value="system">System Default</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="pagination" 
              name="pagination" 
              defaultChecked={profile?.pagination_enabled ?? true}
              className="w-5 h-5 accent-(--color-primary)"
            />
            <label htmlFor="pagination" className="text-body-md text-(--color-on-dark)">Enable Pagination on Dashboard</label>
          </div>

          <button type="submit" className="w-full bg-(--color-primary) text-(--color-on-primary) text-button rounded-md py-3 mt-4 hover:bg-(--color-primary-active) transition-colors">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
