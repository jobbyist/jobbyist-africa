# MCP Integration Guide

## Overview

This repository is integrated with GitHub Copilot using the Model Context Protocol (MCP) to enable enhanced AI-powered job scraping capabilities through Firecrawl.

## What is MCP?

The Model Context Protocol (MCP) is a protocol that allows AI assistants like GitHub Copilot to access external tools and services. In this case, we use MCP to integrate Firecrawl's web scraping capabilities directly into our development workflow.

## Configuration

The MCP configuration is located in `.github/copilot-mcp.json` and includes:

- **Server Name**: `firecrawl-mcp`
- **Command**: `npx -y firecrawl-mcp`
- **API Key**: Currently hardcoded (see Security section below for best practices)

### Configuration File

The current configuration as deployed:

```json
{
  "mcpServers": {
    "firecrawl-mcp": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "fc-5d157329c1124fb4be0aea028d3eb212"
      }
    }
  }
}
```

> **Note**: This configuration includes a hardcoded API key for immediate use. See the Security section for production recommendations.

## What This Enables

With this MCP integration, GitHub Copilot can:

1. **Access Firecrawl APIs** - Directly interact with Firecrawl's job scraping services
2. **Scrape Job Listings** - Fetch job listings from various sources
3. **Transform Data** - Convert scraped data into application-ready format
4. **Assist Development** - Provide context-aware suggestions for job scraping features

## Usage

The MCP server runs automatically when GitHub Copilot is active in your development environment. The integration is seamless and requires no manual intervention.

### Prerequisites

- GitHub Copilot installed and configured
- Node.js and npm installed (for npx command)
- Valid Firecrawl API key

### How It Works

1. GitHub Copilot detects the MCP configuration in `.github/copilot-mcp.json`
2. When needed, Copilot spawns the firecrawl-mcp server using npx
3. The server connects to Firecrawl using the provided API key
4. Copilot can now query Firecrawl for job scraping operations

## Related Documentation

- [FIRECRAWL_INTEGRATION.md](FIRECRAWL_INTEGRATION.md) - Firecrawl API integration details
- [SETUP_JOB_SCRAPING.md](SETUP_JOB_SCRAPING.md) - Job scraping setup guide
- [JOB_SCRAPING_AUTOMATION.md](JOB_SCRAPING_AUTOMATION.md) - Automation system documentation

## Security

⚠️ **Important Security Notice**: The API key is currently hardcoded in the configuration file (`.github/copilot-mcp.json`). This exposes the credential in version control.

### Current Configuration

The configuration uses a hardcoded API key as provided in the integration requirements. This approach is suitable for:
- Development and testing environments
- Demo or POC deployments
- Shared team API keys with limited scope

### Recommended for Production

For production environments, consider these alternatives:

1. **Environment Variables**: Reference environment variables instead of hardcoding
   ```json
   {
     "mcpServers": {
       "firecrawl-mcp": {
         "command": "npx",
         "args": ["-y", "firecrawl-mcp"],
         "env": {
           "FIRECRAWL_API_KEY": "${FIRECRAWL_API_KEY}"
         }
       }
     }
   }
   ```

2. **Secret Management**: Use GitHub Secrets or other secret management systems
3. **Key Rotation**: Regularly rotate API keys and update the configuration
4. **Access Monitoring**: Monitor API usage for unusual activity
5. **Scope Limitation**: Use API keys with minimal required permissions

### Best Practices

- ✅ Never commit production API keys to public repositories
- ✅ Use separate API keys for development and production
- ✅ Set up API key expiration and rotation policies
- ✅ Monitor and audit API key usage
- ✅ Revoke compromised keys immediately

## Troubleshooting

### MCP Server Not Starting

If the MCP server fails to start:

1. Ensure npx is available: `npx --version`
2. Check if firecrawl-mcp package is accessible: `npx -y firecrawl-mcp --help`
3. Verify API key is valid
4. Check GitHub Copilot logs for error messages

### API Key Issues

If you encounter authentication errors:

1. Verify the API key in `.github/copilot-mcp.json`
2. Test the key directly with Firecrawl API
3. Check if the key has necessary permissions
4. Contact Firecrawl support if needed

## References

- [Firecrawl MCP Server](https://github.com/mendableai/firecrawl-mcp) - Official MCP server implementation
- [Model Context Protocol](https://modelcontextprotocol.io/) - MCP specification
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot) - Copilot integration guides
