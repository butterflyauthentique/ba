# Shiprocket MCP Server Setup Guide

## Overview

The Shiprocket MCP (Model Context Protocol) Server enables AI clients like Claude Desktop or Cursor to interact with Shiprocket's logistics platform through natural language commands. This allows you to manage shipping operations conversationally without manually calling APIs.

## Key Features

- **Real-time shipping rates** for any pincode, city, or state
- **Create/update orders** with dimensions, weight, and address details
- **Assign couriers and schedule pickups** effortlessly
- **Generate shipping labels** in one step
- **Cancel orders/shipments** before dispatch
- **Track shipments** using AWB, Shiprocket Order ID, or source order ID
- **Complete order workflow management** from creation to delivery

## Available Tools

| Tool Name | Description |
|-----------|-------------|
| `shipping_rate_calculator` | Get shipping rates for a package between origin and destination |
| `estimated_date_of_delivery` | Estimate delivery date based on locations |
| `order_create` | Create a new shipment/order in Shiprocket |
| `order_list` | List recent orders created via the account |
| `order_track` | Track orders using AWB, Shiprocket Order ID, or source ID |
| `order_ship` | Assign courier and generate shipping for an order |
| `order_pickup_schedule` | Schedule pickup for an existing order |
| `generate_shipment_label` | Generate or retrieve shipping label (PDF) |
| `order_cancel` | Cancel a created order before shipping |
| `list_pickup_addresses` | Retrieve configured pickup addresses |

## Prerequisites

- **Node.js**: v22.14.0 or higher (but < v23)
- **AI Client**: Claude Desktop or Cursor app
- **Shiprocket Account**: Valid email and password

## Installation Steps

### 1. Clone the Repository

```bash
# Navigate to a suitable directory (e.g., your home directory or projects folder)
cd ~
git clone https://github.com/bfrs/shiprocket-mcp.git
cd shiprocket-mcp
```

### 2. Install Dependencies

```bash
npm install
npm run build
```

### 3. Configure AI Client Integration

#### For Claude Desktop

Create or edit the configuration file at:
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

Add the following configuration:

```json
{
  "mcpServers": {
    "shiprocket": {
      "command": "npm",
      "args": ["--prefix", "/Users/pritinupur/shiprocket-mcp", "start", "--silent"],
      "env": {
        "SELLER_EMAIL": "your-shiprocket-email@example.com",
        "SELLER_PASSWORD": "your-shiprocket-password"
      }
    }
  }
}
```

#### For Cursor

Create or edit the configuration file at:
```
~/.cursor/mcp.json
```

Add the following configuration:

```json
{
  "mcpServers": {
    "shiprocket": {
      "command": "npm",
      "args": ["--prefix", "/Users/pritinupur/shiprocket-mcp", "start", "--silent"],
      "env": {
        "SELLER_EMAIL": "your-shiprocket-email@example.com",
        "SELLER_PASSWORD": "your-shiprocket-password"
      }
    }
  }
}
```

> [!IMPORTANT]
> Replace the path `/Users/pritinupur/shiprocket-mcp` with the actual path where you cloned the repository.
> Replace `your-shiprocket-email@example.com` and `your-shiprocket-password` with your actual Shiprocket credentials.

### 4. Restart Your AI Client

- **Claude Desktop**: Quit and reopen the application
- **Cursor**: Restart the application

After restarting, you should see "Shiprocket" as an available MCP integration.

## Usage Examples

### Example 1: Get Shipping Rates

**Natural Language Command:**
```
"How much does it cost to send a 1kg package from Delhi to Bangalore with COD?"
```

**Expected Response:**
```
You have 3 courier options:
- Delhivery Express: ₹85, Delivery in 2 days
- Bluedart: ₹110, Delivery in 1 day
- Xpressbees: ₹90, Delivery in 3 days

COD available with all options.
```

### Example 2: Create and Ship an Order

**Command 1:**
```
"Create a shipment for a 2kg item from Mumbai to Pune. COD ₹999. Customer name is Ramesh, phone is 9876543210."
```

**Response:**
```
New Order created successfully with Shiprocket Order ID: SR123456.
```

**Command 2:**
```
"Ship the order using the fastest courier."
```

**Response:**
```
Shipped via Delhivery. AWB Number: DLV987654321
```

### Example 3: Schedule Pickup and Download Label

**Command 1:**
```
"Schedule a pickup for Order SR123456 for tomorrow."
```

**Response:**
```
Pickup scheduled for 24 July, 10 AM to 1 PM.
```

**Command 2:**
```
"Download the shipping label for Order SR123456."
```

**Response:**
```
Here's your label (PDF): [Download Label]
```

## Architecture Overview

- **MCP Protocol via STDIO**: Communicates with AI clients using standard I/O streams
- **Core Components**:
  - **HTTP Client**: Authenticates with Shiprocket using email/password to fetch a bearer token
  - **Tool Mapper**: Receives MCP calls → runs validation → dispatches to Shiprocket's REST endpoints
  - **Error Handling**: Wraps API calls with structured responses to AI clients
- **Code Layout**:
  - `src/transports/stdio.ts`: MCP–stdio handler
  - `src/mcp/tools.ts`: Tool definitions and parameter schemas
  - `src/mcp/connections.ts`: Authentication/session management

## Security Considerations

> [!CAUTION]
> Your Shiprocket credentials are stored in plain text in the MCP configuration file. Ensure that:
> - The configuration file has appropriate file permissions (readable only by you)
> - You don't commit this file to version control
> - You use a dedicated Shiprocket account with limited permissions if possible

## Troubleshooting

### MCP Server Not Showing Up

1. Verify Node.js version: `node --version` (should be v22.14.0 or higher, but < v23)
2. Check that the build was successful: `npm run build` in the shiprocket-mcp directory
3. Verify the path in the configuration file is correct
4. Check the AI client's logs for any error messages

### Authentication Errors

1. Verify your Shiprocket email and password are correct
2. Ensure your Shiprocket account is active
3. Check if there are any IP restrictions on your Shiprocket account

### Tool Not Working

1. Check the AI client's console for error messages
2. Verify the tool name and parameters match the documentation
3. Ensure you have the necessary permissions in your Shiprocket account

## Integration with Your Project

Once the MCP server is configured, you can use it directly within Claude or Cursor to:

1. **Test shipping rates** before implementing them in your application
2. **Debug order creation** issues by creating test orders conversationally
3. **Track shipments** without logging into the Shiprocket dashboard
4. **Generate labels** for manual order processing
5. **Prototype new features** before coding them

This MCP integration complements your existing Shiprocket Cloud Functions integration in the `functions/` directory, providing a conversational interface for development and testing.

## References

- [Shiprocket API Documentation](https://apidocs.shiprocket.in/)
- [Shiprocket MCP Server GitHub](https://github.com/bfrs/shiprocket-mcp)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)

## Next Steps

After setting up the MCP server, you can:

1. Test the integration by asking your AI client to get shipping rates
2. Create test orders to verify the workflow
3. Use the MCP tools to debug your existing Shiprocket integration
4. Explore automating repetitive shipping tasks through natural language commands
