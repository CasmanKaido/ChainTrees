export function Leaderboard({ data }) {
    return `
        <div class="leaderboard">
            <h2 class="leaderboard-title">Top Planters</h2>
            <table class="leaderboard-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Address</th>
                        <th>XP</th>
                        <th>Level</th>
                        <th>Streak</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map((row, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td class="address-cell">${row.address}</td>
                            <td>${row.xp}</td>
                            <td>${row.level}</td>
                            <td>${row.streak}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}
