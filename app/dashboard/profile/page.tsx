import { createClient } from "@/lib/supabase";
import { getProfile, updateProfile } from "@/actions/profile";
import { ActionForm } from "@/components/ActionForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null; // Will be handled by middleware
  }

  const profile = await getProfile();

  return (
    <div className="w-full max-w-2xl mx-auto px-4 md:px-6 py-6 md:py-10 flex flex-col gap-6 md:gap-8 flex-1">
      <h1 className="text-title-lg text-(--color-on-dark)">Profile Settings</h1>

      <div className="bg-(--color-surface-card-dark) rounded-xl border border-(--color-hairline-on-dark) p-6">
        <ActionForm
          action={updateProfile}
          successMessage="Profile updated successfully!"
          className="flex flex-col gap-6"
        >
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
            <label className="block text-body-sm mb-1 text-(--color-muted)">
              New Password (leave blank to keep current)
            </label>
            <input
              type="password"
              name="password"
              className="w-full bg-(--color-canvas-dark) border border-(--color-hairline-on-dark) rounded-md px-3 py-2 text-body-md focus:border-(--color-primary) focus:outline-none text-(--color-on-dark)"
              placeholder="••••••••"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="flex flex-col gap-4 border-t border-(--color-hairline-on-dark) pt-6">
            <h3 className="text-body-md font-semibold text-(--color-on-dark)">Preferences</h3>

            <div className="flex items-center justify-between p-4 bg-(--color-canvas-dark)/50 rounded-xl border border-(--color-hairline-on-dark)">
              <div className="flex flex-col">
                <span className="text-body-md text-(--color-on-dark)">Enable Status Tracking</span>
                <span className="text-caption text-(--color-muted)">
                  Transactions marked as "Pending" will be excluded from chart totals and summaries.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  name="enable_status_tracking"
                  defaultChecked={profile?.enable_status_tracking ?? false}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-(--color-surface-elevated-dark) border border-(--color-hairline-on-dark) peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-indigo-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-(--color-canvas-dark)/50 rounded-xl border border-(--color-hairline-on-dark)">
              <div className="flex flex-col">
                <span className="text-body-md text-(--color-on-dark)">Show Cursor Trail</span>
                <span className="text-caption text-(--color-muted)">
                  Enable the glowing magic trail follow your cursor.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  name="show_cursor_trail"
                  defaultChecked={profile?.show_cursor_trail ?? true}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-(--color-surface-elevated-dark) border border-(--color-hairline-on-dark) peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-indigo-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-(--color-canvas-dark)/50 rounded-xl border border-(--color-hairline-on-dark)">
              <div className="flex flex-col">
                <span className="text-body-md text-(--color-on-dark)">Enable Pagination</span>
                <span className="text-caption text-(--color-muted)">
                  Split the transaction list into multiple pages.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  name="pagination"
                  defaultChecked={profile?.pagination_enabled ?? true}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-(--color-surface-elevated-dark) border border-(--color-hairline-on-dark) peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-indigo-500"></div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-(--color-primary) text-(--color-on-primary) text-button rounded-md py-3 mt-4 hover:bg-(--color-primary-active) transition-colors"
          >
            Save Changes
          </button>
        </ActionForm>
      </div>
    </div>
  );
}
