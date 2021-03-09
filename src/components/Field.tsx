import React, { useEffect, useState } from 'react';
import { Paragraph, Tabs, Tab, TabPanel, Button } from '@contentful/forma-36-react-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

interface FieldProps {
    sdk: FieldExtensionSDK;
}

const Field = (props: FieldProps) => {
    const [entries, setEntries] = useState([]);
    const [selectedId, setSelected] = useState('');

    useEffect(() => {
        const referenceEntryIds: string[] = props.sdk.field
            .getValue()
            .map((v: any) => v.sys.id);

        Promise.all(
            referenceEntryIds.map((id: string) => props.sdk.space.getEntry(id))
        ).then((data: any) => {
            setEntries(data);
            setSelected(data[0].sys.id);
        });
    });
    const selectedEntry = entries.find((entry: any) => entry.sys.id === selectedId);

    if (!selectedEntry) {
      return null;
    }

    return (
      <div>
        <Tabs role="navigation" withDivider>
          {entries.map((entry: any) => (
            <Tab id={entry.sys.id} selected={selectedId === entry.sys.id}
              onSelect={() => setSelected(entry.sys.id)}
            >
              {entry.fields.title['en-US']}
            </Tab>
          ))}
        </Tabs>
        <TabPanel id="first">
          {/* @ts-ignore */}
          {documentToReactComponents(selectedEntry.fields.body['en-US'])}
          {/* @ts-ignore */}
          <Button onClick={() => props.sdk.navigator.openEntry(selectedEntry.sys.id, {slideIn: true})}>Open Entry</Button>
        </TabPanel>
      </div>
    );
};

export default Field;
