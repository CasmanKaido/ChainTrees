<span class="gov-stat-label">Active Proposals</span>
          </div >
  <div class="gov-stat-item">
    <span class="gov-stat-value">${proposals.length}</span>
    <span class="gov-stat-label">Total Proposals</span>
  </div>
        </div >

        <h2 style="margin:2rem 0 1rem; color:#e2e8f0">Proposals</h2>
        <div id="proposals-list"></div>
      </div >
  `;

this.renderProposals(proposals);
this.attachListeners();
    }
  } catch (error) {
    alert('Execution failed: ' + error.message);
  }
}

generateMockProposals() {
  governanceSystem.createProposal(
    'Increase Staking APY to 8%',
    'Proposal to increase the base staking APY from 5% to 8% to attract more long-term holders.',
    '0xDaoMember1',
    7
  );
  governanceSystem.createProposal(
    'Add Redwood Species',
    'Introduce the Redwood tree species as a Legendary rarity item.',
    '0xDaoMember2',
    3
  );
}
}
