## Review


### Issues
1. You have ChakraUI installed but you have not actually used it, view this to see how to use components [Components](https://chakra-ui.com/docs/components/concepts/overview)

**Example Button**
```
// Top of page
import { Button, ButtonGroup } from "@chakra-ui/react"

...

<Button onClick={handleClick}>+ Add Todo</Button>
```

### My Changes
- I've deleted the template svgs in public
- Moved globals.css into a styles directory (just better convention)


### Next Steps
1. Update your page to use ChakraUI
2. I want you to update filters so its just a single input, which can filter by title and description
3. When I click add note, I want the date to be autofilled to the current date
4. Update filtering by date to have a filter by start date and end date