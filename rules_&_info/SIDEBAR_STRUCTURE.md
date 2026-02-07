# Sidebar Configuration Structure

## Overview

The sidebar now supports a hybrid structure that allows both flat items and nested groups with accordion behavior.

## JSON Structure

The `sidebar_config.json` file (hosted on CloudFront) should follow this structure:

```json
[
  {
    "id": "acc_sec",
    "title": "Account & Security",
    "source_file": "account_security.json"
  },
  {
    "id": "trading",
    "title": "Trading",
    "children": [
      {
        "id": "spot_trade",
        "title": "Spot Trading",
        "source_file": "spot_trading.json"
      },
      {
        "id": "fut_trade",
        "title": "Futures Trading",
        "source_file": "futures_trading.json"
      },
      {
        "id": "grid",
        "title": "Grid Trading",
        "source_file": "grid_trading.json"
      },
      {
        "id": "margin",
        "title": "Margin Trading",
        "source_file": "margin.json"
      }
    ]
  },
  {
    "id": "copy_trading",
    "title": "Copy Trading",
    "children": [
      {
        "id": "copy_spot",
        "title": "Spot Copy Trading",
        "source_file": "spot_copy_trading.json"
      },
      {
        "id": "copy_fut",
        "title": "Futures Copy Trading",
        "source_file": "futures_copy_trading.json"
      }
    ]
  },
  {
    "id": "task_center",
    "title": "Task Center",
    "source_file": "task_center.json"
  }
]
```

## Item Types

### Flat Item (No Children)

A standard category that links directly to content:

```json
{
  "id": "unique_id",
  "title": "Display Name",
  "source_file": "content_file.json"
}
```

### Group Item (Has Children)

A parent category that contains nested items:

```json
{
  "id": "group_id",
  "title": "Group Name",
  "children": [
    {
      "id": "child_id",
      "title": "Child Name",
      "source_file": "child_content.json"
    }
  ]
}
```

## Required Groups

Based on requirements, the following groups MUST be created:

1. **Trading Group** - Contains:
   - Spot Trading
   - Futures Trading
   - Grid Trading
   - Margin Trading

2. **Copy Trading Group** - Contains:
   - Spot Copy Trading
   - Futures Copy Trading

## Flat Items (Remain at Root Level)

All other categories should remain as flat items at the root level:

- Account & Security
- Task Center
- Deposit & Withdrawal
- Staking
- Fiat & Crypto
- Promotion Program
- Download App
- AML
- All Cryptocurrency

## UI Behavior

### Flat Items

- Click → Navigate directly to category content
- Hover → Purple background with shadow
- Selected → Light gray background with purple left border

### Group Items

- Click → Toggle accordion (show/hide children)
- Chevron icon rotates 180° when expanded
- Children appear underneath with left indent
- Child items follow flat item styling

## CloudFront Update Required

⚠️ **Important:** After implementing this code, you must update the `sidebar_config.json` file on CloudFront S3 to match the new structure above. The frontend code expects the JSON to include the `children` array for grouped items.

## Validation

The component will gracefully handle:

- Items with empty/missing `children` array → Renders as flat item
- Items with `children` array → Renders as accordion group
- Missing `source_file` → Will be handled by CategoryContent component
