export class ProfileForm {
    constructor(initialData, onSave) {
        this.data = initialData;
        this.onSave = onSave;
    }

    render() {
        return `
      <div class="settings-section">
        <h2 class="section-title">
          <i class="fas fa-user-circle"></i> Profile Settings
        </h2>

        <div class="profile-avatar-container">
          <div class="current-avatar">
            ${this.data.avatar || '👤'}
          </div>
          <div>
            <button class="avatar-upload-btn">Change Avatar</button>
            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.5rem;">
              Recommended: 400x400px
            </p>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Username</label>
          <input type="text" id="username-input" class="form-input" value="${this.data.username || ''}" placeholder="Enter username">
        </div>

        <div class="form-group">
          <label class="form-label">Email (Optional)</label>
          <input type="email" id="email-input" class="form-input" value="${this.data.email || ''}" placeholder="Enter email for notifications">
        </div>

        <div class="form-group">
          <label class="form-label">Bio</label>
          <textarea id="bio-input" class="form-input" rows="3" placeholder="Tell us about your forestry journey...">${this.data.bio || ''}</textarea>
        </div>

        <button class="save-btn" id="save-profile-btn">Save Changes</button>
      </div>
    `;
    }

    attachListeners(container) {
        const btn = container.querySelector('#save-profile-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                const newData = {
                    username: container.querySelector('#username-input').value,
                    email: container.querySelector('#email-input').value,
                    bio: container.querySelector('#bio-input').value
                };
                this.onSave(newData);
            });
        }
    }
}
