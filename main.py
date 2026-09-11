import sys


if __name__ == "__main__":
    from streamlit.web import cli as stcli

    sys.argv = ["streamlit", "run", "app.py", "--server.headless", "true"]
    sys.exit(stcli.main())