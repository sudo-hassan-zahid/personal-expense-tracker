/**
 * Page/Route: page.tsx
 */
import { createClient } from "@/lib/supabase";
import { getProfile, updateProfile } from "@/actions/profile";
import { ActionForm, SubmitButton } from "@/components/ActionForm";
import { deleteAccountData } from "@/actions/account";
import { HelpLabel, HelpTip } from "@/components/HelpTip";

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
          key={JSON.stringify(profile)}
          action={updateProfile}
          successMessage="Profile updated successfully!"
          className="flex flex-col gap-6"
        >
          <div>
            <HelpLabel help="The display name shown around your account." className="mb-1">
              Name
            </HelpLabel>
            <input
              type="text"
              name="name"
              defaultValue={profile?.name || ""}
              className="form-control w-full text-body-md"
              placeholder="Your Name"
            />
          </div>

          <div>
            <HelpLabel help="The email used for sign in and account recovery." className="mb-1">
              Email Address
            </HelpLabel>
            <input
              type="email"
              name="email"
              defaultValue={user.email || ""}
              className="form-control w-full text-body-md"
              placeholder="Email"
            />
          </div>

          <div>
            <HelpLabel
              help="Fill this only when you want to change your password."
              className="mb-1"
            >
              New Password (leave blank to keep current)
            </HelpLabel>
            <input
              type="password"
              name="password"
              className="form-control w-full text-body-md"
              placeholder="••••••••"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <HelpLabel help="Controls how amounts are formatted across the app." className="mb-1">
                Currency
              </HelpLabel>
              <select
                name="currency"
                defaultValue={profile?.currency || "USD"}
                className="form-control w-full text-body-md"
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
              <HelpLabel help="Choose dark, light, or follow your device setting." className="mb-1">
                Theme
              </HelpLabel>
              <select
                name="theme"
                defaultValue={profile?.theme || "dark"}
                className="form-control w-full text-body-md"
              >
                <option value="dark">Dark Theme</option>
                <option value="light">Light Theme</option>
                <option value="system">System Default</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-(--color-hairline-on-dark) pt-6">
            <div className="flex items-center gap-2">
              <h3 className="text-body-md font-semibold text-(--color-on-dark)">Preferences</h3>
              <HelpTip label="Preferences help">
                These settings adjust dashboard behavior without changing existing transactions.
              </HelpTip>
            </div>

            <div className="flex items-center justify-between p-4 bg-(--color-canvas-dark)/50 rounded-xl border border-(--color-hairline-on-dark)">
              <div className="flex flex-col">
                <span className="flex items-center gap-2 text-body-md text-(--color-on-dark)">
                  Enable Status Tracking
                  <HelpTip label="Status tracking help">
                    Adds Done and Pending states. Pending transactions stay visible but are excluded
                    from summaries.
                  </HelpTip>
                </span>
                <span className="text-caption text-(--color-muted)">
                  Transactions marked as &quot;Pending&quot; will be excluded from chart totals and
                  summaries.
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
                <span className="flex items-center gap-2 text-body-md text-(--color-on-dark)">
                  Show Cursor Trail
                  <HelpTip label="Cursor trail help">
                    Toggles the visual cursor effect only. It does not affect your data.
                  </HelpTip>
                </span>
                <span className="text-caption text-(--color-muted)">
                  Enable a color-shifting neon trail that follows your cursor.
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
                <span className="flex items-center gap-2 text-body-md text-(--color-on-dark)">
                  Auto Carry Forward Balance
                  <HelpTip label="Auto carry forward help">
                    Adds the previous balance into each selected month automatically.
                  </HelpTip>
                </span>
                <span className="text-caption text-(--color-muted)">
                  Keep last month&apos;s remaining balance included after refresh and sign in.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  name="auto_carry_forward_balance"
                  defaultChecked={profile?.auto_carry_forward_balance ?? false}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-(--color-surface-elevated-dark) border border-(--color-hairline-on-dark) peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-indigo-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-(--color-canvas-dark)/50 rounded-xl border border-(--color-hairline-on-dark)">
              <div className="flex flex-col">
                <span className="flex items-center gap-2 text-body-md text-(--color-on-dark)">
                  Enable Pagination
                  <HelpTip label="Pagination help">
                    Splits long transaction lists into pages for easier browsing.
                  </HelpTip>
                </span>
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

          <SubmitButton
            className="w-full bg-(--color-primary) text-(--color-on-primary) text-button rounded-md py-3 mt-4 hover:bg-(--color-primary-active) transition-colors"
            loadingText="Saving Changes..."
          >
            Save Changes
          </SubmitButton>
        </ActionForm>
      </div>

      <div className="bg-(--color-surface-card-dark) rounded-xl border border-red-500/30 p-6">
        <div className="mb-2 flex items-center gap-2">
          <h2 className="text-title-md text-(--color-trading-down)">Delete Account Data</h2>
          <HelpTip label="Delete account data help">
            This clears finance data after confirmation. It does not delete your login account.
          </HelpTip>
        </div>
        <p className="text-body-sm text-(--color-muted) mb-4">
          Permanently removes transactions, categories, budgets, savings goals, and recurring rules.
        </p>
        <ActionForm
          action={deleteAccountData}
          successMessage="Account data deleted"
          className="flex flex-col md:flex-row gap-3"
          confirmation={{
            title: "Delete Account Data?",
            description:
              "This permanently removes your transactions, categories, budgets, savings goals, and recurring rules. Your login account stays active.",
            confirmLabel: "Delete Data",
          }}
        >
          <input
            name="confirmation"
            placeholder="Type DELETE"
            className="form-control flex-1 text-body-md focus:border-(--color-trading-down)"
          />
          <SubmitButton
            className="bg-(--color-trading-down) text-white text-button rounded-md px-5 py-3 hover:opacity-90 transition-colors"
            loadingText="Deleting..."
          >
            Delete Data
          </SubmitButton>
        </ActionForm>
      </div>
    </div>
  );
}
