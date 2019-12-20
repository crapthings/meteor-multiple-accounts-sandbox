import React from 'react'

const SwtichPanel = ({ accounts, lastAccount, changeServer }) => {
  return (
    <div>
      {accounts.map((account, accountIdx) => {
        const style = {
          color: account.userId ? 'green' : (account.failedStatus ? 'red' : 'grey'),
        }

        if (lastAccount === accountIdx) {
          style.backgroundColor = 'green'
          style.color = 'white'
        }

        return (
          <div>
            <span style={{ marginRight: '8px' }}>{account.username}</span>
            <span style={{ marginRight: '8px' }}>{account.url}</span>
            <span style={{ marginRight: '8px' }}>{account.userId}</span>
            <button
              key={`switch-account-${accountIdx}`}
              style={style}
              onClick={evt => {
                if (account.failedStatus) return alert('无法切换到该服务器')
                changeServer(accountIdx)
              }}
            >
              {account.username}: {account.url}
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default SwtichPanel
